import _ from 'lodash'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useForm } from "react-hook-form"

import { query, graphqlQuery } from '../lib/stardog'

const FormInputRender = ({ register }) => (input) => {
  if (input?.type === 'text') {
    return (
      <div>
        <div>{input.label}</div>
        <input type={input.type} name={input.name} ref={register} />
      </div>
    )
  }

  if (input?.type === 'radio') {
    return (
      <div>
        <div>{input.label}</div>
        {_.map(input?.hasOption, (option) => (
          <label>
            <input type={input.type} name={input.name} defaultValue={option.value} defaultChecked={option.checked} ref={register} />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    )
  }

  if (input?.type === 'checkbox') {
    return (
      <div>
        <div>{input.label}</div>
        {_.map(input?.hasOption, (option) => (
          <label>
            <input type={input.type} name={input.name} defaultValue={option.value} defaultChecked={option.checked} ref={register} />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    )
  }
}

const FormSectionRender = ({ showMap, register }) => (hasSection) => {
  const render = (
    <div>
      {hasSection.name}
      {_.isPlainObject(hasSection?.hasInput) ? (
        FormInputRender({ register })(hasSection?.hasInput)
      ) : (
        _.map(hasSection?.hasInput, FormInputRender({ register }))
      )}
    </div>
  )

  if (showMap[hasSection?.name] === undefined) {
    return render
  }

  if (showMap[hasSection?.name]?.watch === showMap[hasSection?.name]?.show?.value) {
    return render
  }
}

const Form = ({ method, action, form }) => {
  const router = useRouter()
  const { register, watch, handleSubmit, reset } = useForm()

  const onSubmit = async (data) => {
    console.log(data)

    // await fetch('/api/user', {
    //   body: JSON.stringify(data),
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    // })

    router.push({
      pathname: '/',
      query: { ts: Date.now() }
    })

    reset()
  }

  const { hasSection } = form

  const showMap = _.chain(hasSection)
    .filter('show')
    .map(props => ({ watch: watch(props?.show?.when, props?.show?.value), ...props }))
    .keyBy('name')
    .value()

  // console.log(showMap)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3>{form.name}</h3>
      {_.isPlainObject(hasSection) ? (
        FormSectionRender({ showMap, register })(hasSection)
      ) : (
        _.map(hasSection, FormSectionRender({ showMap, register }))
      )}
      <div>
        <input type='submit' value='提交' />
      </div>
    </form>
  )
}

export default function Users ({ users, userForm }) {
  return (
    <div>
      <Form form={userForm} />
      {/* <table> */}
      {/*   <thead> */}
      {/*     <tr> */}
      {/*       <th>用户名</th> */}
      {/*       <th>姓名</th> */}
      {/*     </tr> */}
      {/*   </thead> */}
      {/*   <tbody> */}
      {/*     {users.map(User)} */}
      {/*   </tbody> */}
      {/* </table> */}
    </div>
  )
}

function User (user) {
  return (
    <tr key={user?.用户.value}>
      <td>{user?.用户名?.value}</td>
      <td>{user?.姓名?.value}</td>
    </tr>
  )
}

export async function getStaticProps () {
  const usersResp = await query(`
    SELECT *
    WHERE {
      ?用户 a :User ;
        :username ?用户名 ;
        :name ?姓名 .
    }
  `, {
    reasoning: true,
  })

  const users = usersResp?.body?.results?.bindings

  const { data: userFormResp } = await graphqlQuery(`
    {
      Form(id: "test") {
        name
        hasSection {
          name
          show @optional {
            when
            value
          }
          hide @optional
          hasInput {
            type
            name
            label
            hasOption @optional {
              value
              label
              checked @optional
            }
          }
        }
      }
    }
  `)

  const userForm = userFormResp?.data?.[0]

  console.log(JSON.stringify(userForm, null, 2))

  return {
    props: {
      users,
      userForm,
    },
  }
}
